package com.example.backend.product.service;

import com.example.backend.product.dto.ProductRequest;
import com.example.backend.product.dto.ProductResponse;
import com.example.backend.product.entity.Product;
import com.example.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    private final ProductRepository productRepository;

    //1. 전체 조회
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::of)
                .collect(Collectors.toList());
    }

    //2. 상품 등록
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .type(request.getType())
                .name(request.getName())
                .price(request.getPrice())
                .durationMonths(request.getDurationMonths())
                .build();
        return ProductResponse.of(productRepository.save(product));
    }

    //3. 상품 수정
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request){
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        product.setType(request.getType());
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDurationMonths(request.getDurationMonths());
        return ProductResponse.of(product);
    }

    //4.상품 삭제

    //ToDo: 상품 구매한 membership 있으면 삭제 불가하거나, 상품 숨김 기능 추가 할지 결정
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)){
            throw new IllegalArgumentException("상품을 찾을 수 없습니다.");
        }

        productRepository.deleteById(id);
    }
}
