import { formatTimeAgo } from "@/utils/formatTime";
import { memoApi } from "./apis";
import { CreateMemoDto, Memo, UpdateMemoDto } from "./types";

/**
 * UI 메모 타입 정의
 */
export interface UIMemo {
  id: string; // UUID 형태로 변경
  title: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  content: string;
  rating: number;
  timeAgo: string;
}

/**
 * 메모 서비스 클래스
 * 메모 관련 비즈니스 로직과 데이터 변환을 담당
 */
export class MemoService {
  /**
   * 메모 생성 전 데이터 검증 및 변환
   */
  async createMemoWithValidation(data: CreateMemoDto): Promise<Memo> {
    // 데이터 검증
    if (!data.title.trim()) {
      throw new Error("제목은 필수입니다.");
    }

    if (!data.content.trim()) {
      throw new Error("내용은 필수입니다.");
    }

    if (data.rating < 0 || data.rating > 5) {
      throw new Error("평점은 0-5 사이의 값이어야 합니다.");
    }

    // 데이터 정제
    const processedData: CreateMemoDto = {
      ...data,
      title: data.title.trim(),
      content: data.content.trim(),
      categoryId: data.categoryId,
      description: data.description?.trim(),
    };

    return await memoApi.createMemo(processedData);
  }

  /**
   * 메모 수정 전 데이터 검증 및 변환
   */
  async updateMemoWithValidation(data: UpdateMemoDto): Promise<Memo> {
    // 데이터 검증
    if (data.title && !data.title.trim()) {
      throw new Error("제목은 빈 값일 수 없습니다.");
    }

    if (data.content && !data.content.trim()) {
      throw new Error("내용은 빈 값일 수 없습니다.");
    }

    if (data.rating !== undefined && (data.rating < 0 || data.rating > 5)) {
      throw new Error("평점은 0-5 사이의 값이어야 합니다.");
    }

    // 데이터 정제
    const processedData: UpdateMemoDto = {
      ...data,
      title: data.title?.trim(),
      content: data.content?.trim(),
      categoryId: data.categoryId,
      description: data.description?.trim(),
    };

    return await memoApi.updateMemo(processedData);
  }

  /**
   * 메모 삭제 전 확인
   */
  async deleteMemoWithConfirmation(
    id: string,
    skipConfirmation: boolean = false
  ): Promise<void> {
    if (!skipConfirmation) {
      // 실제 앱에서는 사용자 확인 모달을 띄우거나 다른 확인 로직을 구현
      console.log(`메모 ${id} 삭제 요청`);
    }

    return await memoApi.deleteMemo(id);
  }

  /**
   * 메모 검색 결과 하이라이팅
   */
  async searchMemosWithHighlight(query: string) {
    const result = await memoApi.searchMemos(query);

    // 검색 결과에 하이라이팅 로직 추가
    const highlightedMemos = result.memos.map((memo) => ({
      ...memo,
      highlightedTitle: this.highlightText(memo.title, query),
      highlightedContent: this.highlightText(memo.content, query),
    }));

    return {
      ...result,
      memos: highlightedMemos,
    };
  }

  /**
   * 메모 통계 데이터 가공
   */
  async getMemoInsights() {
    const stats = await memoApi.getMemoStats();
    const categories = await memoApi.getCategories();

    // 통계 데이터 가공
    const insights = {
      ...stats,
      categoryStats: categories,
      averageMemosPerCategory:
        categories.length > 0 ? stats.totalMemos / categories.length : 0,
      topCategory: categories.reduce(
        (prev, current) => (prev.count > current.count ? prev : current),
        categories[0]
      ),
    };

    return insights;
  }

  /**
   * 백엔드 메모 데이터를 UI용 메모 데이터로 변환
   */
  static transformToUIMemos(backendMemos: Memo[] | undefined): UIMemo[] {
    if (!backendMemos) return [];

    return backendMemos.map((memo) => ({
      id: memo.id,
      title: memo.title,
      category: memo.category || {
        id: "default",
        name: "기타",
        color: "#6b7280",
      },
      content: memo.content,
      rating: memo.rating,
      timeAgo: formatTimeAgo(memo.createdAt),
    }));
  }

  /**
   * 텍스트 하이라이팅 헬퍼 함수
   */
  private highlightText(text: string, query: string): string {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  /**
   * 메모 내보내기 (향후 구현)
   */
  async exportMemos(format: "json" | "csv" | "txt" = "json") {
    const allMemos = await memoApi.getMemos({ limit: 1000 }); // 모든 메모 가져오기

    switch (format) {
      case "json":
        return JSON.stringify(allMemos.data, null, 2);
      case "csv":
        // CSV 변환 로직 (향후 구현)
        throw new Error("CSV 내보내기는 아직 지원되지 않습니다.");
      case "txt":
        // TXT 변환 로직 (향후 구현)
        throw new Error("TXT 내보내기는 아직 지원되지 않습니다.");
      default:
        throw new Error("지원되지 않는 형식입니다.");
    }
  }
}

export const memoService = new MemoService();
